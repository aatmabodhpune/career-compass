import { useNavigate } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/InputField';

export default function Demographics() {
    const navigate = useNavigate();

    return (
        <Container>
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Card className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Tell us about yourself</h1>
                        <p className="text-gray-500 text-sm mt-2">This helps us personalize your report.</p>
                    </div>

                    <div className="space-y-6 text-left">
                        <InputField 
                            label="Age" 
                            id="age"
                            type="number" 
                            placeholder="e.g. 16"
                        />
                        
                        <div className="space-y-1.5">
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 ml-1">Gender</label>
                            <select 
                                id="gender"
                                className="w-full px-5 py-2.5 bg-gray-50 border-2 border-transparent rounded-full text-gray-900 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all duration-200"
                            >
                                <option>Select...</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                                <option>Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-6">
                        <Button onClick={() => navigate('/dashboard')} className="w-full" size="lg">Continue</Button>
                        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="w-full text-gray-500">Skip</Button>
                    </div>
                </Card>
            </div>
        </Container>
    );
}
