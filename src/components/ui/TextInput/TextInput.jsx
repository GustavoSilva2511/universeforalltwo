export default function TextInput({ value, onChange, type = "text", placeholder, label, ...rest }) {
    return (
        <label className="flex flex-col items-center gap-1">
            {label ? <span className="text-sm text-slate-200">{label}</span> : null}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="rounded bg-white px-3 py-2 text-black"
                {...rest}
            />
        </label>
    )
}
