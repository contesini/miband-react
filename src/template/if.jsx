export default props => {
    if(!props.hidden) {
        return props.children
    } else {
        return false
    }
}