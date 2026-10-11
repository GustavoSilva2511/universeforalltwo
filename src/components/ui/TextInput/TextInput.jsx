export default function TextInput({ value, onChange, type = "text", placeholder, label, id = "apod-date", ...rest }) {
    return (
        <div className="flex w-full flex-col gap-1.5">
            {label ? (
                <label htmlFor={id} className="text-sm font-medium text-slate-300">
                    {label}
                </label>
            ) : null}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-starlight placeholder:text-slate-500 backdrop-blur transition focus:border-nebula"
                {...rest}
            />
        </div>
    )
}
