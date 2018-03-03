var express = require('express');
var router = express.Router();
var fs = require('fs');
var findings;
var path ="./data/reports";
var rstats = ['OK','WARN','FAIL','UNKNOWN'];
var issues = [0,0,0,0];

router.get('/audits',function(request, response){
  var files=[];
      files=fs.readdirSync(path);
  response.render('audits',{
      pageTitle: 'Audits',
      pageId: 'audits',
      files: files
    });
})

router.get('/audits/:report',function(request, response){
    var reportname = request.params.report;
    var report = fs.readFileSync(path+'/'+reportname);
    findings = JSON.parse(report);
    issues = [0,0,0,0]; //reset issues

    // statistics
    findings.forEach(function(finding){
      switch(finding.status){
        case "OK":
          issues[0]++;
          break;
        case "WARN":
            issues[1]++;
          break;
        case "FAIL":
          issues[2]++;
          break;
        case "UNKNOWN":
          issues[3]++;
          break;
        default:
      }
      // console.log(issues);
    });


    // response.send(findings[0].category);

    response.render('auditreport',{
      pageTitle: 'Audit Report',
      pageId: 'auditreport',
      findings: findings,
      reportname: reportname,
      rstats: rstats,
      issues: issues
    });
})

module.exports = router;
