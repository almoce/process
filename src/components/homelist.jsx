export function HomeList(props) {
    const {list = []} = props
    return <ul className='home-list'>
        {list.map(i => {
            return <a key={i.link} href={i.link} title={i.title}>
                <li>
                    {i.title}
                    <span>{i.date}</span>
                </li>
            </a>
        })}
</ul>
}