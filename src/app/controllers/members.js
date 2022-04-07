const {age, date} = require('../../lib/utils')

module.exports = {
  index(req, res){
    return res.render("members/index")
  },
  create(req, res){
    return res.render("members/create")
  },
  post(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')      
      }
    }
    let {avatar_url, birth, name, services, gender} = req.body
  
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.members.length + 1)
  
    data.members.push({
      id,
      name,
      avatar_url,
      birth,
      gender,
      services,
      created_at,
    })
  
    fs.writeFile("data.json", JSON.stringify(data,  null, 2), function(err){
      if (err) return res.send("Write file error!") 
  
      return res.redirect("/members")
    })
    // return res.send(req.body)
  },
  show(req, res){  
    //req.params
    const { id } = req.params
    const foundInstructor = data.members.find(function(member) {
      return member.id == id
    })
    if (!foundInstructor) return res.send("Instructor not found!")

    const member = {
      ...foundInstructor,
      age: age(foundInstructor.birth),
      services: foundInstructor.services.split(","),
      created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render("members/show", {member})
  },
  edit(req, res){  
    //req.params
    const { id } = req.params
    const foundInstructor = data.members.find(function(member) {
      return member.id == id
    })
    if (!foundInstructor) return res.send("Instructor not found!")
  
    const member ={
      ...foundInstructor,
      birth: date(foundInstructor.birth).iso
    }
  
    return res.render('members/edit', {member}) 
  },
  put(req, res){
    const { id } = req.body
    let index = 0

    const foundInstructor = data.members.find(function(member, foundIndex) {
      if(id == member.id){
          index = foundIndex
          return true
      }
    })
    //console.log(index)
    if (!foundInstructor) return res.send("Instructor not found!")

    const member = {
      ...foundInstructor,
      ...req.body,
      birth: Date.parse(req.body.birth),
      id: Number(req.body.id)
    }
    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err){
      if (err) return res.send("Write error!")

      return res.redirect(`/members/${id}`)
    })
  },
  delete(req, res){
    const {id} = req.body

    const filteredInstructors = data.members.filter(function(member){
      return member.id != id
    })
  
    data.members = filteredInstructors
  
    fs.writeFile("data.json", JSON.stringify(data,  null, 2), function (err){
      if (err) return res.send("Write file error!")
  
      return res.redirect("/members")
    })
  }
}
