import { Loader2 } from "lucide-react";

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500 animate-in fade-in duration-300">
            <Loader2 size={40} className="animate-spin text-primary mb-3" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default Loading;
