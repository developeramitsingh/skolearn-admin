import axios from 'axios';

class Axios {
    static instance;

    static getInstance() {
        if (!Axios.instance) {
            Axios.instance = new Axios();
        }

        return Axios.instance;
    }

    get(options) {
        options.method = "get";
        options.headers = options.headers ? options.headers : this.getHeaders();
        return new Promise((resolve, reject) => {
          axios
            .get(options.url, options)
            .then((response) => {
              resolve(response.data);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }

    post(options) {
        options.method = "POST";
        options.headers = options.headers ? options.headers : this.getHeaders();
        options.headers["content-type"] = "application/json";
        options.timeout = 1000*500;

        return new Promise((resolve, rej) => {
            axios(options)
                .then((res) => {
                    resolve(res);
                })
                .catch(err => {
                    rej(err);
                });
        });
    }

    upload(options) {
        options.method = "POST";
        options.headers = this.getHeaders();
        options.headers["content-type"] = "multipart/form-data";
        return new Promise((resolve, reject) => {
          axios(options)
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }

      patch(options) {
        options.method = "PATCH";
        //options.headers = this.getHeaders();
        return new Promise((resolve, reject) => {
          axios(options)
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
    
      put(options) {
        options.method = "PUT";
        options.headers = this.getHeaders();
        return new Promise((resolve, reject) => {
          axios(options)
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }

      delete(options) {
        options.method = "DELETE";
        options.headers = this.getHeaders();
        return new Promise((resolve, reject) => {
          axios(options)
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }

    getHeaders() {
        const token = localStorage.getItem('token');
        return {
          Authorization: token ? `Bearer ${token}` : null,
        };
    }

}

export default Axios.getInstance();