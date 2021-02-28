const reduceDate = (date) => {
    return new Date(date - (date % (1000 * 60 * 60 * 24)))
}

export default reduceDate