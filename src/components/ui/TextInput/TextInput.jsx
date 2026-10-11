import "./TextInput.css"

export default function TextInput({ value, onChange, type = "text", placeholder, label, ...rest }) {
    return (
        <label>
            {label ? <span>{label}</span> : null}
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} {...rest} />
        </label>
    )
}
