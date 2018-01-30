var express=require('express');
var request=require('request');
var bodyParser=require('body-parser');
var jsonQuery = require('json-query');
var app=express();

app.get('/nodeapi/user-stats',(req,res)=>{
    count=req.query.count;

    request({
        url:`https://randomuser.me/api/?results=${count}&nat=US&inc=gender,dob,location`,
        json:true
    },(err,response,body)=>{
        if(response.statusCode===200)
        {
           //res.send('Records Found')
           var records=body.results;
                //console.log(records);
                /* var data={records:records};
                console.log(data);
                var a= jsonQuery('records[gender=female]', {data:data});
                var b= jsonQuery('records[gender=male]', {data:data});
                console.log(a);
                console.log(a.count);
                console.log(b.length);*/
          fcount=0;
          mcount=0;
          groupA=0;
          groupB=0;
          groupC=0;
          groupD=0;
          var arr=[];
          for(i=0;i<records.length;i++)
          {
              
              if(records[i].gender=="female")
              fcount=fcount+1;
              if(records[i].gender=="male")
              mcount=mcount+1;
              var dob= records[i].dob;
              var diff=Date.now() - new Date(dob).getTime();
              var agedate=new Date(diff);
              var age=Math.abs(agedate.getUTCFullYear() - 1970);
              if(age>0 && age<=15)
                groupA = groupA + 1;
              if(age>15 && age<=30)
                groupB = groupB + 1;
              if(age>30 && age<=60)
                groupC = groupC + 1;
              if(age>60)
                groupD = groupD + 1;
             
             loc = records[i].location;
             postcode=loc.postcode;
             arr.push(postcode);//push postcodes in array
          }
      
         var male_percent=mcount/count*100;
          var female_percent=fcount/count*100;
          var sex_distribution={
              "male":male_percent,
              "female":female_percent
          };
           var ageDistribution={
              "A":groupA,
              "B":groupB,
              "C":groupC,
              "D":groupD
          };
         // console.log(sex_distribution);


        var obj = { }; 
        // Take the occurances of post codes in the object
        for (var k = 0, j = arr.length; k < j; k++) {

            if (obj[arr[k]]) {

                obj[arr[k]]++;
            }
            else {
                obj[arr[k]] = 1;
            } 
        }
        //sort the postcode object-For this we need to convert an object to an array.
        var sortedPostCodes=sortProperties(obj);
        // Grab top 5 records from array using slice method.
        var top5PostCodes=sortedPostCodes.slice(0, 5);
        var finalResult = {};
        for(var m=0; m<top5PostCodes.length;m++)
        {
            var childArr = top5PostCodes[m];
            finalResult[childArr[0]] =childArr[1]; //here key will be childArr[0] and value will be childArr[1] for finalResult objcect.

        }
        //console.log(finalResult);
        function sortProperties(obj)
        {
                // convert object into array
                var sortable=[];
                for(var key in obj)
                    if(obj.hasOwnProperty(key))
                        sortable.push([key, obj[key]]); // each item is an array in format [key, value]
                
                // sort items by value
                sortable.sort(function(a, b)
                {
                return b[1]-a[1]; // compare numbers
                });
                return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
        }

          var details={
              "user-count":count,
              "status":"Success",
              "sex_distribution":sex_distribution,
              "ageDistribution":ageDistribution,
              "topLocation":finalResult
          
          };
         // console.log(`Text JSON Format :${details}`)
        
          res.send(details);
        }
    })
});
app.listen(3000,()=>{
    console.log('connected to server');
})