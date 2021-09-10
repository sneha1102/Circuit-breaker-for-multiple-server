import {Request, Response} from "express";

const express = require("express");
const app=express();

const port = 3002;


app.get( '/test2', (req: Request, res: Response) => {

    if ( Math.random() > 0.3 ) {
        res.status( 200 ).send( "Success test2!" );
    } else {
        res.status( 500 ).send( "Failed! test 2" );
    }

});

app.listen(port,() => console.log(`Listening at http://localhost:${port}`));