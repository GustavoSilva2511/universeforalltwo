import './Header.css'

export default function Header({ title }) {
    return (
        <header className='main-header'>
            <h1 className='title'>{title}</h1>
        </header>
    )
}
