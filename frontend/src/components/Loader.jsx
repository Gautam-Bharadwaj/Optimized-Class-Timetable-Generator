import { Loader2 } from 'lucide-react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-full min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );
};

export default Loader;
