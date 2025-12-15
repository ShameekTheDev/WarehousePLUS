'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
    const [assets, setAssets] = useState([])
    const [filteredAssets, setFilteredAssets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('active')
    const [editingCell, setEditingCell] = useState(null)
    const [editValue, setEditValue] = useState('')

    // Google Sheets configuration
    // Replace with your actual Google Sheets JSON endpoint
    const SHEETS_JSON_URL = process.env.NEXT_PUBLIC_SHEETS_JSON_URL || ''
    const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || ''

    // Fetch assets from Google Sheets
    useEffect(() => {
        fetchAssets()
    }, [])

    // Apply filters whenever dependencies change
    useEffect(() => {
        applyFilters()
    }, [assets, searchQuery, typeFilter, statusFilter])

    const fetchAssets = async () => {
        try {
            setLoading(true)

            // For demo purposes, using mock data
            // Replace this with actual Google Sheets fetch
            const mockData = [
                {
                    id: 1,
                    name: 'Main Stylesheet',
                    type: 'css',
                    url: 'https://cdn.example.com/styles/main.css',
                    tags: 'layout,responsive,core',
                    version: '2.1.0',
                    status: 'active',
                    updatedAt: '2024-12-15T10:30:00Z'
                },
                {
                    id: 2,
                    name: 'App Bundle',
                    type: 'js',
                    url: 'https://cdn.example.com/scripts/app.bundle.js',
                    tags: 'core,production',
                    version: '3.0.2',
                    status: 'active',
                    updatedAt: '2024-12-14T15:20:00Z'
                },
                {
                    id: 3,
                    name: 'Hero Background',
                    type: 'img',
                    url: 'https://cdn.example.com/images/hero-bg.webp',
                    tags: 'hero,landing,optimized',
                    version: '1.0.0',
                    status: 'active',
                    updatedAt: '2024-12-13T09:15:00Z'
                },
                {
                    id: 4,
                    name: 'Analytics Script',
                    type: 'js',
                    url: 'https://cdn.example.com/scripts/analytics.js',
                    tags: 'tracking,analytics',
                    version: '1.5.0',
                    status: 'beta',
                    updatedAt: '2024-12-12T14:00:00Z'
                },
                {
                    id: 5,
                    name: 'Legacy Theme',
                    type: 'css',
                    url: 'https://cdn.example.com/styles/legacy-theme.css',
                    tags: 'deprecated,legacy',
                    version: '1.0.0',
                    status: 'disabled',
                    updatedAt: '2024-11-20T08:00:00Z'
                },
                {
                    id: 6,
                    name: 'Logo SVG',
                    type: 'img',
                    url: 'https://cdn.example.com/images/logo.svg',
                    tags: 'branding,logo,vector',
                    version: '2.0.0',
                    status: 'active',
                    updatedAt: '2024-12-10T11:30:00Z'
                }
            ]

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800))

            setAssets(mockData)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching assets:', error)
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...assets]

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(asset => asset.status === statusFilter)
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(asset => asset.type === typeFilter)
        }

        // Search filter (name, tags, url)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(asset =>
                asset.name.toLowerCase().includes(query) ||
                asset.tags.toLowerCase().includes(query) ||
                asset.url.toLowerCase().includes(query)
            )
        }

        setFilteredAssets(filtered)
    }

    const handleCellEdit = (assetId, field, currentValue) => {
        setEditingCell({ assetId, field })
        setEditValue(currentValue)
    }

    const handleCellSave = async (assetId, field) => {
        try {
            // Update local state immediately for better UX
            const updatedAssets = assets.map(asset =>
                asset.id === assetId ? { ...asset, [field]: editValue } : asset
            )
            setAssets(updatedAssets)

            // Send update to Google Apps Script
            if (APPS_SCRIPT_URL) {
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: assetId,
                        field: field,
                        value: editValue
                    })
                })
            }

            setEditingCell(null)
            setEditValue('')
        } catch (error) {
            console.error('Error updating asset:', error)
            // Revert on error
            fetchAssets()
        }
    }

    const handleCellCancel = () => {
        setEditingCell(null)
        setEditValue('')
    }

    const getStats = () => {
        const total = assets.length
        const active = assets.filter(a => a.status === 'active').length
        const css = assets.filter(a => a.type === 'css').length
        const js = assets.filter(a => a.type === 'js').length
        const img = assets.filter(a => a.type === 'img').length

        return { total, active, css, js, img }
    }

    const stats = getStats()

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-container">
                            <Image
                                src="/Logo.svg"
                                alt="Warehouse+ Logo"
                                width={160}
                                height={40}
                                className="logo"
                                priority
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                className="btn btn-secondary"
                                onClick={fetchAssets}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Refreshing...
                                    </>
                                ) : (
                                    <>
                                        <span>🔄</span>
                                        Refresh
                                    </>
                                )}
                            </button>
                            <button className="btn btn-primary">
                                <span>➕</span>
                                Add Asset
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="container">
                    <div className="filter-content">
                        {/* Search */}
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search assets by name, tags, or URL..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Type Filters */}
                        <div className="filter-group">
                            <button
                                className={`btn btn-secondary ${typeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setTypeFilter('all')}
                            >
                                All Types
                            </button>
                            <button
                                className={`btn btn-secondary ${typeFilter === 'css' ? 'active' : ''}`}
                                onClick={() => setTypeFilter('css')}
                            >
                                CSS
                            </button>
                            <button
                                className={`btn btn-secondary ${typeFilter === 'js' ? 'active' : ''}`}
                                onClick={() => setTypeFilter('js')}
                            >
                                JavaScript
                            </button>
                            <button
                                className={`btn btn-secondary ${typeFilter === 'img' ? 'active' : ''}`}
                                onClick={() => setTypeFilter('img')}
                            >
                                Images
                            </button>
                        </div>

                        {/* Status Filters */}
                        <div className="filter-group">
                            <button
                                className={`btn btn-secondary ${statusFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('all')}
                            >
                                All Status
                            </button>
                            <button
                                className={`btn btn-secondary ${statusFilter === 'active' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('active')}
                            >
                                Active
                            </button>
                            <button
                                className={`btn btn-secondary ${statusFilter === 'beta' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('beta')}
                            >
                                Beta
                            </button>
                            <button
                                className={`btn btn-secondary ${statusFilter === 'disabled' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('disabled')}
                            >
                                Disabled
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Assets</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Active</div>
                        <div className="stat-value">{stats.active}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">CSS Files</div>
                        <div className="stat-value">{stats.css}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">JS Files</div>
                        <div className="stat-value">{stats.js}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Images</div>
                        <div className="stat-value">{stats.img}</div>
                    </div>
                </div>

                {/* Assets Table */}
                <div className="table-container fade-in">
                    <div className="table-wrapper">
                        {loading ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">⏳</div>
                                <h3>Loading assets...</h3>
                            </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📦</div>
                                <h3>No assets found</h3>
                                <p>Try adjusting your filters or search query</p>
                            </div>
                        ) : (
                            <table className="asset-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>URL</th>
                                        <th>Tags</th>
                                        <th>Version</th>
                                        <th>Status</th>
                                        <th>Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssets.map((asset) => (
                                        <tr key={asset.id}>
                                            <td>{asset.id}</td>

                                            {/* Editable Name */}
                                            <td
                                                className="cell-editable"
                                                onClick={() => handleCellEdit(asset.id, 'name', asset.name)}
                                            >
                                                {editingCell?.assetId === asset.id && editingCell?.field === 'name' ? (
                                                    <input
                                                        type="text"
                                                        className="cell-input"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleCellSave(asset.id, 'name')}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleCellSave(asset.id, 'name')
                                                            if (e.key === 'Escape') handleCellCancel()
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <>
                                                        {asset.name}
                                                        <span className="edit-icon">✏️</span>
                                                    </>
                                                )}
                                            </td>

                                            {/* Type Badge */}
                                            <td>
                                                <span className={`badge badge-${asset.type}`}>
                                                    {asset.type.toUpperCase()}
                                                </span>
                                            </td>

                                            {/* Editable URL */}
                                            <td
                                                className="cell-editable url-cell"
                                                onClick={() => handleCellEdit(asset.id, 'url', asset.url)}
                                            >
                                                {editingCell?.assetId === asset.id && editingCell?.field === 'url' ? (
                                                    <input
                                                        type="text"
                                                        className="cell-input"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleCellSave(asset.id, 'url')}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleCellSave(asset.id, 'url')
                                                            if (e.key === 'Escape') handleCellCancel()
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <>
                                                        <a href={asset.url} target="_blank" rel="noopener noreferrer">
                                                            {asset.url}
                                                        </a>
                                                        <span className="edit-icon">✏️</span>
                                                    </>
                                                )}
                                            </td>

                                            {/* Editable Tags */}
                                            <td
                                                className="cell-editable"
                                                onClick={() => handleCellEdit(asset.id, 'tags', asset.tags)}
                                            >
                                                {editingCell?.assetId === asset.id && editingCell?.field === 'tags' ? (
                                                    <input
                                                        type="text"
                                                        className="cell-input"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleCellSave(asset.id, 'tags')}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleCellSave(asset.id, 'tags')
                                                            if (e.key === 'Escape') handleCellCancel()
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="tags-cell">
                                                        {asset.tags.split(',').map((tag, idx) => (
                                                            <span key={idx} className="tag-chip">
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                        <span className="edit-icon">✏️</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Editable Version */}
                                            <td
                                                className="cell-editable"
                                                onClick={() => handleCellEdit(asset.id, 'version', asset.version)}
                                            >
                                                {editingCell?.assetId === asset.id && editingCell?.field === 'version' ? (
                                                    <input
                                                        type="text"
                                                        className="cell-input"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleCellSave(asset.id, 'version')}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleCellSave(asset.id, 'version')
                                                            if (e.key === 'Escape') handleCellCancel()
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <>
                                                        {asset.version}
                                                        <span className="edit-icon">✏️</span>
                                                    </>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td>
                                                <span className={`badge badge-${asset.status}`}>
                                                    {asset.status}
                                                </span>
                                            </td>

                                            {/* Updated Date */}
                                            <td>
                                                {new Date(asset.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
