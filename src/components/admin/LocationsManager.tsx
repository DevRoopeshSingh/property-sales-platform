"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown, MapPin, Building2, Map } from "lucide-react";
import type { LocationTree } from "@/lib/data/locations";
import { addState, addCity, addLocality, deleteLocation } from "@/app/admin/(dashboard)/locations/actions";

export default function LocationsManager({ initialTree }: { initialTree: LocationTree }) {
  const [tree, setTree] = useState<LocationTree>(initialTree);
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});
  
  const [addingState, setAddingState] = useState(false);
  const [addingCityFor, setAddingCityFor] = useState<string | null>(null);
  const [addingLocalityFor, setAddingLocalityFor] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggleState = (id: string) => {
    setExpandedStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCity = (id: string) => {
    setExpandedCities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddState = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    setError(null);
    startTransition(async () => {
      const result = await addState(newItemName.trim());
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setTree([...tree, { id: result.data.id, name: result.data.name, cities: [] }]);
        setAddingState(false);
        setNewItemName("");
      }
    });
  };

  const handleAddCity = async (e: React.FormEvent, stateId: string) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    setError(null);
    startTransition(async () => {
      const result = await addCity(stateId, newItemName.trim());
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setTree(tree.map(s => {
          if (s.id === stateId) {
            return { ...s, cities: [...s.cities, { id: result.data.id, name: result.data.name, localities: [] }] };
          }
          return s;
        }));
        setAddingCityFor(null);
        setNewItemName("");
        setExpandedStates(prev => ({ ...prev, [stateId]: true }));
      }
    });
  };

  const handleAddLocality = async (e: React.FormEvent, cityId: string, stateId: string) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    setError(null);
    startTransition(async () => {
      const result = await addLocality(cityId, newItemName.trim());
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setTree(tree.map(s => {
          if (s.id === stateId) {
            return {
              ...s,
              cities: s.cities.map(c => {
                if (c.id === cityId) {
                  return { ...c, localities: [...c.localities, { id: result.data.id, name: result.data.name }] };
                }
                return c;
              })
            };
          }
          return s;
        }));
        setAddingLocalityFor(null);
        setNewItemName("");
        setExpandedCities(prev => ({ ...prev, [cityId]: true }));
      }
    });
  };

  const handleDelete = async (type: 'state' | 'city' | 'locality', id: string, parentId?: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    setError(null);
    startTransition(async () => {
      const result = await deleteLocation(type, id);
      if (result.error) {
        setError(result.error);
      } else {
        if (type === 'state') {
          setTree(tree.filter(s => s.id !== id));
        } else if (type === 'city' && parentId) {
          setTree(tree.map(s => s.id === parentId ? { ...s, cities: s.cities.filter(c => c.id !== id) } : s));
        } else if (type === 'locality' && parentId) {
          setTree(tree.map(s => ({
            ...s,
            cities: s.cities.map(c => c.id === parentId ? { ...c, localities: c.localities.filter(l => l.id !== id) } : c)
          })));
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Location Management</h2>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage the States, Cities, and Localities hierarchy.</p>
        </div>
        <button 
          onClick={() => { setAddingState(true); setNewItemName(""); }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add State
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-3">
          <div className="mt-0.5 font-bold">Error:</div>
          <div>{error}</div>
        </div>
      )}

      {addingState && (
        <div className="card p-4 bg-slate-50 border-blue-200">
          <form onSubmit={handleAddState} className="flex gap-3">
            <input
              type="text"
              autoFocus
              placeholder="State Name"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              className="input flex-1"
              disabled={isPending}
            />
            <button type="submit" disabled={isPending || !newItemName.trim()} className="btn btn-primary">Save</button>
            <button type="button" onClick={() => setAddingState(false)} className="btn btn-secondary" disabled={isPending}>Cancel</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {tree.map(state => (
          <div key={state.id} className="card overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleState(state.id)}>
                <button className="p-1 hover:bg-slate-200 rounded">
                  {expandedStates[state.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                <Map className="text-blue-500" size={20} />
                <h3 className="font-bold text-lg">{state.name}</h3>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{state.cities.length} Cities</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setAddingCityFor(state.id); setNewItemName(""); setExpandedStates(prev => ({ ...prev, [state.id]: true })); }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 hover:bg-blue-50 rounded"
                >
                  + Add City
                </button>
                <button 
                  onClick={() => handleDelete('state', state.id)}
                  className="text-slate-400 hover:text-red-600 p-1.5"
                  title="Delete State"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedStates[state.id] && (
              <div className="p-4 bg-white space-y-4">
                {addingCityFor === state.id && (
                  <form onSubmit={e => handleAddCity(e, state.id)} className="flex gap-3 ml-8 mb-4">
                    <input
                      type="text"
                      autoFocus
                      placeholder="City Name"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      className="input flex-1 max-w-sm"
                      disabled={isPending}
                    />
                    <button type="submit" disabled={isPending || !newItemName.trim()} className="btn btn-primary text-sm py-1.5">Save</button>
                    <button type="button" onClick={() => setAddingCityFor(null)} className="btn btn-secondary text-sm py-1.5" disabled={isPending}>Cancel</button>
                  </form>
                )}

                {state.cities.length === 0 && !addingCityFor && (
                  <div className="text-slate-400 text-sm ml-8 italic">No cities added yet.</div>
                )}

                {state.cities.map(city => (
                  <div key={city.id} className="ml-8 border-l-2 border-slate-100 pl-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleCity(city.id)}>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                          {expandedCities[city.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <Building2 className="text-emerald-500" size={18} />
                        <span className="font-semibold text-slate-800">{city.name}</span>
                        <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{city.localities.length} Localities</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setAddingLocalityFor(city.id); setNewItemName(""); setExpandedCities(prev => ({ ...prev, [city.id]: true })); }}
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-800 px-2 py-1 hover:bg-emerald-50 rounded"
                        >
                          + Add Locality
                        </button>
                        <button 
                          onClick={() => handleDelete('city', city.id, state.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete City"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {expandedCities[city.id] && (
                      <div className="ml-8 space-y-2 mt-2">
                        {addingLocalityFor === city.id && (
                          <form onSubmit={e => handleAddLocality(e, city.id, state.id)} className="flex gap-2 mb-3">
                            <input
                              type="text"
                              autoFocus
                              placeholder="Locality Name"
                              value={newItemName}
                              onChange={e => setNewItemName(e.target.value)}
                              className="input flex-1 max-w-xs text-sm py-1.5"
                              disabled={isPending}
                            />
                            <button type="submit" disabled={isPending || !newItemName.trim()} className="btn btn-primary text-xs px-3 py-1.5">Save</button>
                            <button type="button" onClick={() => setAddingLocalityFor(null)} className="btn btn-secondary text-xs px-3 py-1.5" disabled={isPending}>Cancel</button>
                          </form>
                        )}

                        {city.localities.length === 0 && !addingLocalityFor && (
                          <div className="text-slate-400 text-sm italic">No localities added yet.</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {city.localities.map(locality => (
                            <div key={locality.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 hover:border-slate-300 transition-colors">
                              <div className="flex items-center gap-2">
                                <MapPin className="text-slate-400" size={14} />
                                <span className="text-sm text-slate-700">{locality.name}</span>
                              </div>
                              <button 
                                onClick={() => handleDelete('locality', locality.id, city.id)}
                                className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                                title="Delete Locality"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {tree.length === 0 && !addingState && (
          <div className="card p-12 text-center text-slate-500">
            No locations found. Start by adding a state.
          </div>
        )}
      </div>
    </div>
  );
}
