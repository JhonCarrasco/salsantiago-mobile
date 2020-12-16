
const chooseIcon = (routeName, focused) => {
    let iconName;

    switch(routeName) {
        case "Home":
            iconName = `home${ focused ? '' : '-outline'}`
            break;
        case "Book":
            iconName = `clipboard-text${ focused ? '' : '-outline'}`
            break;
        case "Business":
            iconName = `folder-clock${ focused ? '' : '-outline'}`
            break;        
        case "Profile":
            iconName = `account${ focused ? '' : '-outline'}`
            break;
        default:
            break;
        
    }
    return iconName

}

export default chooseIcon