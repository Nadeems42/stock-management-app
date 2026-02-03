import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, Wrench, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';


interface Repair {
    id: number;
    job_card_number: string;
    device_model: string;
    issue_description: string;
    status: string;
    Customer: {
        name: string;
        phone: string;
    }
}

const Repairs = () => {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState(true);

    // New Repair Form State
    const [showForm, setShowForm] = useState(false);
    const [newRepair, setNewRepair] = useState({
        customer_name: '',
        customer_phone: '',
        device_model: '',
        issue_description: '',
        estimated_cost: '',
        advance_payment: ''
    });

    useEffect(() => {
        fetchRepairs();
    }, []);

    const fetchRepairs = async () => {
        try {
            const res = await api.get('/repairs');
            setRepairs(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/repairs', newRepair);
            toast.success('Job Card Created');
            setShowForm(false);
            setNewRepair({ customer_name: '', customer_phone: '', device_model: '', issue_description: '', estimated_cost: '', advance_payment: '' });
            fetchRepairs();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Repairs</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" /> New Job Card
                </Button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-lg font-bold mb-4">Create New Job Card</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Customer Name" value={newRepair.customer_name} onChange={e => setNewRepair({ ...newRepair, customer_name: e.target.value })} required />
                        <Input placeholder="Customer Phone" value={newRepair.customer_phone} onChange={e => setNewRepair({ ...newRepair, customer_phone: e.target.value })} required />
                        <Input placeholder="Device Model" value={newRepair.device_model} onChange={e => setNewRepair({ ...newRepair, device_model: e.target.value })} required />
                        <Input placeholder="Issue Description" value={newRepair.issue_description} onChange={e => setNewRepair({ ...newRepair, issue_description: e.target.value })} required />
                        <Input type="number" placeholder="Estimated Cost" value={newRepair.estimated_cost} onChange={e => setNewRepair({ ...newRepair, estimated_cost: e.target.value })} />
                        <Input type="number" placeholder="Advance Payment" value={newRepair.advance_payment} onChange={e => setNewRepair({ ...newRepair, advance_payment: e.target.value })} />
                        <div className="col-span-2">
                            <Button type="submit">Create Job Card</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">Job No</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Device</th>
                            <th className="px-6 py-3">Issue</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {repairs.map(repair => (
                            <tr key={repair.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium">{repair.job_card_number}</td>
                                <td className="px-6 py-3">
                                    <div>{repair.Customer.name}</div>
                                    <div className="text-xs text-gray-500">{repair.Customer.phone}</div>
                                </td>
                                <td className="px-6 py-3">{repair.device_model}</td>
                                <td className="px-6 py-3 text-gray-500 truncate max-w-xs">{repair.issue_description}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                                ${repair.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            repair.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                repair.status === 'ready' ? 'bg-indigo-100 text-indigo-700' :
                                                    repair.status === 'completed' || repair.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        repair.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'}`}>
                                        {repair.status.replace('_', ' ')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Repairs;
