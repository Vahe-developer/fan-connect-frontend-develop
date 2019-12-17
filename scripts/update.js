const devD = Object.keys(pj.dependencies)
const devdD = Object.keys(pj.devDependencies)

const printD = () => {
    let scr = "yarn remove "

    let dD = ""
    let d = ""

    devdD.forEach(key => {
        dD += key+ " "
    })

    devD.forEach(key => {
        d += key+ " "
    })

    scr += d
    scr += dD

    scr += " && yarn add "
    scr += d

    scr += " && yarn -D add "
    scr += dD

    return scr;
}

console.log(printD())