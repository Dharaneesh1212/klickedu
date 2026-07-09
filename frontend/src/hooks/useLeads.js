import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: parseInt(params.get('page')) || 1,
      limit: parseInt(params.get('limit')) || 10,
      search: params.get('search') || '',
      status: params.get('status') || '',
      leadSource: params.get('leadSource') || '',
      priority: params.get('priority') || '',
      stage: params.get('stage') || '',
      subStage: params.get('subStage') || '',
      country: params.get('country') || '',
      courseInterested: params.get('courseInterested') || '',
      assignedEmployee: params.get('assignedEmployee') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      followUpStartDate: params.get('followUpStartDate') || '',
      followUpEndDate: params.get('followUpEndDate') || '',
      sortField: params.get('sortField') || 'createdAt',
      sortOrder: params.get('sortOrder') || 'desc',
    };
  };

  const [filters, setFilters] = useState(parseURLParams);

  // Sync URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page > 1) params.set('page', filters.page);
    if (filters.limit !== 10) params.set('limit', filters.limit);
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.leadSource) params.set('leadSource', filters.leadSource);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.stage) params.set('stage', filters.stage);
    if (filters.subStage) params.set('subStage', filters.subStage);
    if (filters.country) params.set('country', filters.country);
    if (filters.courseInterested) params.set('courseInterested', filters.courseInterested);
    if (filters.assignedEmployee) params.set('assignedEmployee', filters.assignedEmployee);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.followUpStartDate) params.set('followUpStartDate', filters.followUpStartDate);
    if (filters.followUpEndDate) params.set('followUpEndDate', filters.followUpEndDate);
    if (filters.sortField !== 'createdAt') params.set('sortField', filters.sortField);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/lead', { params: filters });
      setLeads(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLeads();
    }, 400);
    return () => clearTimeout(handler);
  }, [fetchLeads]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && key !== 'limit' && key !== 'sortField' && key !== 'sortOrder' ? { page: 1 } : {}), // reset page to 1 if filter changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: '',
      leadSource: '',
      priority: '',
      stage: '',
      subStage: '',
      country: '',
      courseInterested: '',
      assignedEmployee: '',
      startDate: '',
      endDate: '',
      followUpStartDate: '',
      followUpEndDate: '',
      sortField: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return {
    leads,
    total,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    fetchLeads,
  };
};

export default useLeads;
