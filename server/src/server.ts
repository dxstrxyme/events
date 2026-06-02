import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors'
import 'dotenv/config';
import 'reflect-metadata';
import { validateEnv , env } from "../config/env";
import { AppDataSource } from "./db/data-sourse";

const app = fastify({logger:true});

const start = async ()=>{
    try {
        validateEnv();

        await app.register(cors,{
            origin:true,
            metods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
            allowedHeaders:['Content-Type','Authorization']
        })

        await app.register(fastifyJwt,{
            secret:env.jwtSecret
        })

        await AppDataSource.initialize();
        app.log.info('Database connected')

        await app.listen({port:env.port , host:env.host})
        app.log.info(`Server running on PORT ${env.port}`)
    } catch (error) {
        if(AppDataSource.isInitialized){
            await AppDataSource.destroy()
        }
        app.log.error(error);
        process.exit(1)
    }
}
start();