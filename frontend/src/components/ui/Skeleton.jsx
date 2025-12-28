import clsx from "clsx";

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={clsx("animate-pulse bg-slate-200 rounded-lg", className)}
            {...props}
        />
    );
};

export default Skeleton;
