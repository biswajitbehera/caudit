var express = require('express');
var router = express.Router();
var fs = require('fs');
var findings;
var path ="data/reports";

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
    // var statistics = [{'ok':0,'warn':0,'fail':0,'unknown':0 }];
    // // statistics
    // findings.forEach(function(finding){
    //   if(finding.status=='OK'){statistics['ok']++;}
    // })

    // response.send(findings[0].category);

    response.render('auditreport',{
      pageTitle: 'Audit Report',
      pageId: 'auditreport',
      findings: findings,
      reportname: reportname
    });
})

module.exports = router;
