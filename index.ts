import {Request, Response} from "express";

const express = require("express");
const app=express();

const port = 3001;


app.get( '/test1', (req: Request, res: Response) => {

    if ( Math.random() > 0.5 ) {
        res.status( 200 ).send( "Success!" );
    } else {
        res.status( 400 ).send( "Failed!" );
    }

});

app.listen(port,() => console.log(`Listening at http://localhost:${port}`));