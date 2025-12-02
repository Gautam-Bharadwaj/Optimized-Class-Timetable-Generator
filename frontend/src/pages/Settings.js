
import { useUiStore } from '../store/ui.store';

const Settings = () => {
    const { theme, setTheme } = useUiStore();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Theme:</span>
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
