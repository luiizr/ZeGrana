import { Express } from "express";
import { criarDashboard } from "@ze-grana/core";

export default class criarDashboardController {
    constructor(
        servidor: Express,
        cdu: criarDashboard
    ){
        servidor.post("/api/criarDashboard", async (req, res) => {
            try {
                
            }
        }
    }