//update docs
db.logs.updateMany({"employee": "Alouw2"}, {$set: {"worktype": "NORMAL"}}, {multi:true})