
const characterRemove = (array = null , string = null) => {

    if(string) {
      const newStr = string.toLowerCase()
      return newStr.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
    }
    else if (array) {

      const newArray = []
      for( item of array ) {
        const lowerCaseString = item.toLowerCase()  
        const noCharacterString = lowerCaseString.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
        
        newArray.push(noCharacterString)
      }
      return newArray
    }
}

module.exports =  { characterRemove };