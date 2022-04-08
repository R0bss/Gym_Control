const {age, date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  index(req, res){
    return res.render("instructors/index", { instructors: data.instructors})
  },
  create(req, res){
    return res.render("instructors/create")
  },
  post(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if (req.body[key] == "") {
        return res.send('Please, fill all fields!')      
      }
    }

    const query = `
      INSERT INTO INSTRUCTORS (
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `
    
    const values = [
      req.body.name,
      req.body.avatar_url,
      req.body.gender,
      req.body.services,
      date(req.body.birth).iso,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results){
      if(err) return res.send("Database Error!")

      return res.redirect(`/instructors/${results.rows[0].id}`)
    })
  },
  show(req, res){  
    //req.params
    const { id } = req.params
    const foundInstructor = data.instructors.find(function(instructor) {
      return instructor.id == id
    })
    if (!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
      ...foundInstructor,
      age: age(foundInstructor.birth),
      services: foundInstructor.services.split(","),
      created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", {instructor})
  },
  edit(req, res){  
    //req.params
    const { id } = req.params
    const foundInstructor = data.instructors.find(function(instructor) {
      return instructor.id == id
    })
    if (!foundInstructor) return res.send("Instructor not found!")
  
    const instructor ={
      ...foundInstructor,
      birth: date(foundInstructor.birth).iso
    }
  
    return res.render('instructors/edit', {instructor}) 
  },
  put(req, res){
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
      if(id == instructor.id){
          index = foundIndex
          return true
      }
    })
    //console.log(index)
    if (!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
      ...foundInstructor,
      ...req.body,
      birth: Date.parse(req.body.birth),
      id: Number(req.body.id)
    }
    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err){
      if (err) return res.send("Write error!")

      return res.redirect(`/instructors/${id}`)
    })
  },
  delete(req, res){
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
      return instructor.id != id
    })
  
    data.instructors = filteredInstructors
  
    fs.writeFile("data.json", JSON.stringify(data,  null, 2), function (err){
      if (err) return res.send("Write file error!")
  
      return res.redirect("/instructors")
    })
  }
}
