import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Demographics() {
    const navigate = useNavigate();

    return (
        <Container>
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Card variant="centered" className="space-y-6 w-full max-w-md">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Tell us about yourself</h1>
                        <p className="text-gray-500 text-sm mt-2">This helps us personalize your report.</p>
                    </div>

                    <div className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input type="text" placeholder="e.g. 16" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option>Select...</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                                <option>Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-2">
                        <Button onClick={() => navigate('/dashboard')} className="w-full justify-center">Continue</Button>
                        <Button variant="secondary" onClick={() => navigate('/dashboard')} className="w-full justify-center border-transparent shadow-none hover:bg-gray-100 bg-transparent text-gray-600">Skip</Button>
                    </div>
                </Card>
            </div>
        </Container>
    );
}
