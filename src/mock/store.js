import fs from 'node:fs';
import path from 'node:path';

export class MockStore {
  constructor(filePath, options = {}) {
    this.filePath = filePath ? path.resolve(process.cwd(), filePath) : null;
    this.readOnly = Boolean(options.readOnly);
    this.data = {};
    this.initialData = {};
    this.load();
  }

  load() {
    if (!this.filePath) {
      this.data = {};
      this.initialData = {};
      return;
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        throw new Error(`Failed to parse JSON file at ${this.filePath}: ${err.message}`);
      }
    } else {
      this.data = {};
      this.persist();
    }

    this.initialData = JSON.parse(JSON.stringify(this.data));
  }

  persist() {
    if (this.readOnly || !this.filePath) return;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[Junior Mock] Failed to save database: ${err.message}`);
    }
  }

  getResources() {
    return Object.keys(this.data).filter(key => Array.isArray(this.data[key]));
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this.data));
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(this.initialData));
    this.persist();
    return this.data;
  }

  setFullData(newData) {
    if (typeof newData !== 'object' || newData === null) {
      throw new Error('Data must be a valid JSON object');
    }
    this.data = JSON.parse(JSON.stringify(newData));
    this.persist();
    return this.data;
  }

  getAll(resource, query = {}) {
    const list = this.data[resource];
    if (!Array.isArray(list)) return null;

    let result = [...list];

    // Search query: ?q=...
    if (query.q) {
      const term = String(query.q).toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(term);
          return String(val).toLowerCase().includes(term);
        });
      });
    }

    // Field filters: ?key=value
    const reservedKeys = new Set(['q', '_page', 'page', '_limit', 'limit', '_sort', 'sort', '_order', 'order']);
    for (const [key, value] of Object.entries(query)) {
      if (reservedKeys.has(key)) continue;

      result = result.filter(item => {
        const itemVal = item[key];
        if (itemVal === undefined) return false;

        if (value === 'true' || value === 'false') {
          return Boolean(itemVal) === (value === 'true');
        }

        if (!isNaN(value) && typeof itemVal === 'number') {
          return itemVal === Number(value);
        }

        return String(itemVal).toLowerCase() === String(value).toLowerCase();
      });
    }

    // Sorting
    const sortField = query._sort || query.sort;
    const sortOrder = (query._order || query.order || 'asc').toLowerCase();
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          comparison = String(valA).localeCompare(String(valB));
        }

        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    const totalCount = result.length;

    // Pagination: ?page=1&limit=10
    const pageParam = query._page || query.page;
    const limitParam = query._limit || query.limit;

    if (pageParam || limitParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1);
      const limit = Math.max(1, parseInt(limitParam, 10) || 10);
      const startIndex = (page - 1) * limit;
      const paginatedData = result.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1
        }
      };
    }

    return {
      data: result,
      totalCount
    };
  }

  getById(resource, id) {
    const list = this.data[resource];
    if (!Array.isArray(list)) return null;
    return list.find(item => String(item.id) === String(id)) || null;
  }

  create(resource, payload) {
    if (!this.data[resource]) {
      this.data[resource] = [];
    }

    const list = this.data[resource];
    let newId = payload.id;
    if (newId === undefined || newId === null) {
      const numericIds = list
        .map(item => Number(item.id))
        .filter(n => !isNaN(n));
      newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    }

    const newItem = {
      id: newId,
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString()
    };

    list.push(newItem);
    this.persist();
    return newItem;
  }

  update(resource, id, payload, replace = false) {
    const list = this.data[resource];
    if (!Array.isArray(list)) return null;

    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;

    const existing = list[index];
    let updated;

    if (replace) {
      updated = {
        id: existing.id,
        ...payload,
        createdAt: existing.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      updated = {
        ...existing,
        ...payload,
        id: existing.id,
        updatedAt: new Date().toISOString()
      };
    }

    list[index] = updated;
    this.persist();
    return updated;
  }

  delete(resource, id) {
    const list = this.data[resource];
    if (!Array.isArray(list)) return false;

    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;

    const removed = list.splice(index, 1)[0];
    this.persist();
    return removed;
  }
}
