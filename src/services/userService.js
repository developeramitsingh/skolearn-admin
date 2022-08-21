
import {  BACKEND_URL } from '../constant/constant';
import axios from '../helpers/axios';
import { rolesService } from './index';
import * as jwt from 'jsonwebtoken';

class UserService {
    static instance;

     static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

     createUser(data) {
        const option = {
            url: `${BACKEND_URL}/userRegister`,
            data,
        };

        return axios.post(option);
    }

    login(data) {
        const option = {
            url: `${BACKEND_URL}/login`,
            data,
        };

        return axios.post(option);
    }

    verifyOtp(data, otpToken) {
        const option = {
            url: `${BACKEND_URL}/verifyotp`,
            headers: {
                'Authorization': `Bearer ${otpToken}`,
            },
            data,
        };

        return axios.post(option);
    }

     getAllUsers() {
        const option = {
            url: `${BACKEND_URL}/users`,
        };

        return axios.get(option);
    }

    doAfterLogin(encodedToken) {
        const decodedToken = jwt.decode(encodedToken, { complete: true });

        localStorage.setItem("token", encodedToken);
        localStorage.setItem("user", JSON.stringify(decodedToken.payload))

        return decodedToken.payload;
    }

    getUser() {
        let user  = localStorage.getItem('user');

        if (user) {
            user = JSON.parse(user);
        }

        return user;
    }

    getRoleKey() {
        let user  = localStorage.getItem('user');

        if (user) {
            user = JSON.parse(user);
        }

        return user.roleId.roleKey;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    async checkDoLogin(path) {
        try {
          if (path) {
            let data = await rolesService.checkRouteAccess(path);
            console.info({data});
            return false;
          }
        } catch (err) {
          console.info("err", err.message);
          this.dologout();
          //historyState.history.push("/login");
        }
    }

    dologout() {
        localStorage.clear();
    }
}

export default UserService.getInstance();
