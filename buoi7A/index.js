const express = require('express');
const fs = require('fs')
const cors = require("cors");
const app = express();
let corsOptions ={
    origin:['http://127.0.0.1:5500','http://localhost:5500']
};
app.use(cors(corsOptions));
///////
var bodyparser = require('body-parser');
var urlParser = bodyparser.urlencoded({ extended: false });
//////
const port = 3000;

const dssv = require('./dssv.json');
//dssv rỗng
//const dssv = require('./dssv_rong.json');

app.get('/',(req, res)=>{
    res.send('Xin chào đến với EXPRESS backend !!!');
});

//GET
app.get('/students',(req, res)=>{
    res.send(Object.values(dssv));
});
app.get('/students/:mssv',(req, res)=>{
    // res.send(dssv[req.params.mssv]);
    console.log(req.params.mssv);
    let i = 0;
    for(i = 0; i < dssv.length; i++)
    {
        if(dssv[i].MaSV == req.params.mssv)
        break;
    }
    if(i < dssv.length)
    {
        res.send(dssv[i]);
    }
    else{
        res.send("Not Found !!!");
    }
});

//POST -> tạo
app.post('/students', urlParser,(req, res)=>{
    var sv = req.body;
    var result = dssv.find(item => item.MaSV === sv.MaSV);
    console.log(result);
    if(result != null && result != undefined)
    {
        var obj ={
            success:false,
            msg:"Mã SV bị trùng!!!"
        };
        res.send(obj);
    }
    else
    {
        dssv.push(sv);
        fs.writeFile('dssv.json', JSON.stringify(dssv), err =>{
            if(err){
                console.log(err);
            }
            else{
                console.log("OK");
            }
        });
        var obj ={
            success:true,
            msg:"Thêm thành công!!!"
        };
        res.send(obj);
    }
});

//PUT -> sửa, cập nhật
app.put('/students', urlParser,(req, res)=>{
    var sv = req.body;
    var i = dssv.findIndex(item => item.MaSV === sv.MaSV);
    console.log(i);
    if(i != null && i != undefined)
    {
        /// cập nhật
        dssv[i] = sv;
        fs.writeFile('dssv.json', JSON.stringify(dssv), err =>{
            if(err){
                console.log(err);
            }
            else{
                console.log("OK");
            }
        });
        var obj ={
            success:true,
            msg:"Cập nhật thành công!!!"
        };
        res.send(obj);
    }
    else
    {
        var obj ={
            success:false,
            msg:"Mã SV không tồn tại!!!"
        };
        res.send(obj);
    }
});

//DELETE
app.delete('/students', urlParser,(req, res)=>{
    var sv = req.body;
    var i = dssv.findIndex(item => item.MaSV === sv.MaSV);
    console.log(i);
    if(i != null && i != undefined)
    {
        /// xóa
        dssv.splice(i,1);
        fs.writeFile('dssv.json', JSON.stringify(dssv), err =>{
            if(err){
                console.log(err);
            }
            else{
                console.log("OK");
            }
        });
        var obj ={
            success:true,
            msg:"Xóa thành công!!!"
        };
        res.send(obj);
    }
    else
    {
        var obj ={
            success:false,
            msg:"Mã SV không tồn tại!!!"
        };
        res.send(obj);
    }
});

app.listen(port,()=> console.log(`App is running at port ${port}`))