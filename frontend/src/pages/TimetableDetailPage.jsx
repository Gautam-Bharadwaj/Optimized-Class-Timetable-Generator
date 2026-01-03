import React, { useState, useEffect } from 'react';
import { timetableApi } from '../api/timetable.api';
import { departmentApi } from '../api/department.api';
import TimetableGrid from '../components/TimetableGrid';
import Loader from '../components/Loader';
import Card from '../components/ui/Card';
import { Search, Filter, Download, Calendar } from 'lucide-react';

const TimetableDetailPage = () => {
    const [departments, setDepartments] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [selectedTimetable, setSelectedTimetable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchingDetail, setFetchingDetail] = useState(false);
    const [filters, setFilters] = useState({
        departmentId: '',
        semester: ''
    });

    useEffect(() => {
        const init = async () => {
            try {
                const [depts, tts] = await Promise.all([
                    departmentApi.getAll(),
                    timetableApi.getAll()
                ]);
                setDepartments(depts);

                // Filter only approved ones for "Final" view
                const approved = tts.filter(t => t.status === 'APPROVED');
                setTimetables(approved);

                if (approved.length > 0) {
                    loadDetail(approved[0].id);
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const loadDetail = async (id) => {
        setFetchingDetail(true);
        try {
            const data = await timetableApi.getById(id);
            setSelectedTimetable(data);
        } catch (error) {
            console.error("Failed to fetch detail", error);
        } finally {
            setFetchingDetail(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredTimetables = timetables.filter(t => {
        const matchDept = !filters.departmentId || t.departmentId === parseInt(filters.departmentId);
        const matchSem = !filters.semester || t.semester === parseInt(filters.semester);
        return matchDept && matchSem;
    });

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Academic Timetables</h1>
                    <p className="text-slate-500">View finalized and approved class schedules.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        {/* Filters */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                                <Filter className="w-4 h-4" /> Filters
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                                <select
                                    name="departmentId"
                                    value={filters.departmentId}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border-slate-200 text-sm focus:ring-blue-500"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label>
                                <select
                                    name="semester"
                                    value={filters.semester}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border-slate-200 text-sm focus:ring-blue-500"
                                >
                                    <option value="">All Semesters</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Approved Schedules ({filteredTimetables.length})
                            </div>
                            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {filteredTimetables.map(tt => (
                                    <div
                                        key={tt.id}
                                        onClick={() => loadDetail(tt.id)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedTimetable?.id === tt.id
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        <div className="font-bold flex items-center justify-between">
                                            {tt.name || `Timetable #${tt.id}`}
                                            {selectedTimetable?.id === tt.id && <Calendar className="w-4 h-4" />}
                                        </div>
                                        <div className={`text-xs mt-1 ${selectedTimetable?.id === tt.id ? 'text-blue-100' : 'text-slate-500'}`}>
                                            {tt.department?.name} • Sem {tt.semester}
                                        </div>
                                    </div>
                                ))}
                                {filteredTimetables.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                                        No approved timetables found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        {fetchingDetail ? (
                            <div className="h-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Loader />
                                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading schedule details...</p>
                            </div>
                        ) : selectedTimetable ? (
                            <div id="timetable-printable" className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl text-white shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-bold">{selectedTimetable.department?.name}</h2>
                                        <div className="flex items-center gap-4 mt-2 text-slate-300">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Semester {selectedTimetable.semester}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                            <span>{selectedTimetable.slots?.length} Scheduled Classes</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 text-right">
                                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Status</div>
                                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 inline-block">
                                            OFFICIALLY APPROVED
                                        </div>
                                    </div>
                                </div>
                                <TimetableGrid slots={selectedTimetable.slots || []} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Select a Timetable</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                                    Select an approved timetable from the left sidebar to view the full weekly schedule.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TimetableDetailPage;
