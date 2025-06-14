import styled from 'npm:styled-components'

const HomeListUl = styled.ul`
    // border-top: 1px solid var(--theme-foreground-fainter);
    max-width: 640px;
    margin: auto;
    padding: 0px;
    margin-top: 30px;
    // padding-top: 30px;
    
    a {
        color: var(--theme-foreground-a);
        text-decoration: none;
        transition: color 0.3s;
    }
    &:hover a {
        color: var(--theme-foreground-fainter);
    }
    &:hover a:hover {
        color: var(--theme-foreground-a);
        text-decoration: none;

    }
     span {
        color: var(--theme-foreground-muted);
    }

    li:marker {
        display: none;
    }
    li {
        display: flex;
        justify-content: space-between;
    }
`

export function HomeList(props) {
    const {list = []} = props
    return <HomeListUl>
        {list.map(i => {
            return <a key={i.link} href={i.link} title={i.title}>
                <li>
                    {i.title}
                    <span>{i.date}</span>
                </li>
            </a>
        })}
</HomeListUl>
}




