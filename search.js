 const filter = (data,events) => {
  
    const res = events.filter((event) => {
        if(data.start === event.start){
            console.log("false")
            return false
          
            
        }
        else{
            console.log("true")
            return true
            
        }
    });

    return res
    }
module.exports = { filter }