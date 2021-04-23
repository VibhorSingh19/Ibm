const pool = require('../config/db')


const getStudentCourses = (req, res) => {
  const { st_id } = req.body
   pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {
        let sql = `SELECT * FROM Course a INNER JOIN CurriculumDetails b ON a.CO_id=b.CO_id WHERE cu_id = (SELECT CU_id FROM Cohort where CH_id = (SELECT CH_id FROM CohortStudent where ST_id=?));`
        let cu_id=st_id;
        conn.query(sql, [cu_id], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else {
              if(result.length > 0) {
                  res.json(result)
              }
              else {
                  res.status(401)
                  res.json({ message: "No Data Found" })
              }
            }
            conn.release();
          })
        }
    })
}

const getStudentSessionPlans = (req, res) => {
  const { co_id } = req.body
  pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {
        let sql = `SELECT SessionPlan.SP_id,SessionPlan.SP_Name,SessionPlan.SP_Duration,SessionPlan.SP_Sequence,SessionPlan.CO_id FROM SessionPlan,CompletedSession WHERE SessionPlan.SP_id=CompletedSession.SP_id AND SessionPlan.CO_id=?`
        
        conn.query(sql,[co_id], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else {
              if(result.length > 0) {
                  res.json(result)
              }
              else {
                  res.status(401)
                  res.json({ message: "No Data Found" })
              }
            }
            conn.release();
          })
        }
    })
}
const getStudentqna = (req, res) => {
  const { question } = req.body
  pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {

        var $commonWords = ['i','a','about','an','and','are','as','at','be','by','com','de','en','for','from','in','is','it','la','of','on','or','that','the','this','to','was','will','with','und','the','www'];
var $text = question;

// Convert to lowercase
$text = $text.toLowerCase();

// replace unnesessary chars. leave only chars, numbers and space
$text = $text.replace(/[^\w\d ]/g, '');

var result = $text.split(' ');

// remove $commonWords
result = result.filter(function (word) {
    return $commonWords.indexOf(word) === -1;
});

// Unique words

console.log(result);

        let sql = `select CF_Answer from ( select ConceptFAQ.*, rank() over (order by IF(CF_Keyword1=?, 1, 0) + IF(CF_Keyword2=?, 1, 0) + IF(CF_Keyword3=?, 1, 0) desc) rnk from ConceptFAQ) as temp  where rnk = 1`
        
        conn.query(sql,[result[0],result[1],result[2]], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else {
              if(result.length > 0) {
                  res.json(result)
                  //console.log("backend:"+result)
              }
              else {
                  res.status(401)
                  res.json({ message: "No Data Found" })
              }
            }
            conn.release();
          })
        }
    })
}
 
const getStudentSections = (req, res) => {
  const { sp_id } = req.body
  pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {
        let sql = "SELECT * FROM SessionSection WHERE SP_id = ?;"
        
        conn.query(sql, [sp_id], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else {
              if(result.length > 0) {
                  res.json(result)
              }
              else {
                  res.status(401)
                  res.json({ message: "No Data Found" })
              }
            }
            conn.release();
          })
        }
    })
}

const getContent = (req, res) => {
  const { ct_id } = req.body
  pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {
        let sql = `SELECT * FROM Content WHERE  CT_id= ?;`
        
        conn.query(sql, [ct_id], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else {
              if(result.length > 0) {
                  res.json(result)
              }
              else {
                  res.status(401)
                  res.json({ message: "No Data Found" })
              }
            }
            conn.release();
          })
        }
    })
}

const markContentStatus = (req, res) => {
  const { st_id, ss_id, ct_id } = req.body
  
  pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {
        let sql = `INSERT INTO CompletedContent (ST_id, SS_id, CT_id, CompleteDate) VALUES (?, ?, ?, NOW());`
        
        conn.query(sql, [st_id, ss_id, ct_id], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else res.json(result)
            conn.release();
          })
        }
    })
}

const getContentStatus = (req, res) => {
  const { st_id } = req.body
  
  pool.getConnection((err, conn) => {
      if(err) res.status(400).send('Connection Error');
      else {
        let sql = `SELECT * FROM CompletedContent WHERE ST_id = ?;`
        
        conn.query(sql, [st_id], (err, result) => {
            if(err) res.status(400).send('Querry Error');
            else res.json(result)
            conn.release();
          })
        }
    })
}

module.exports = {  getStudentqna,getStudentCourses, getStudentSessionPlans, getStudentSections, getContent, markContentStatus, getContentStatus }