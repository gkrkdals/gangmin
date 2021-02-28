const zeroPad = (base, num) => {
    let zeros = ""
    const numOfZeros = num - base.toString().length
    for(let i = 0; i < numOfZeros; i++)
        zeros = zeros.concat('0')

    return numOfZeros > 0 ? zeros + base.toString() : base.toString()
}

export default zeroPad