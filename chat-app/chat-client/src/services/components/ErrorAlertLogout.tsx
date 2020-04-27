export const ErrorAlertLogout = (errorObj: any) => {
    if (errorObj.response && errorObj.response.data && errorObj.response.data.error) {
        let err = errorObj.response.data.error;
        try {
            const error = JSON.parse(err);
            if (Array.isArray(error)) {
                alert(error.map((e: any) => e.msg).join('\n'));
            } else {
                let { name } = error;
                if (name) {
                    alert(name + ": Login again to refresh.");
                    return true;
                }
                alert(error.response.data.error);
            }
        } catch (e) {
            alert(err);
        }
        return false;
    } else {
        alert(errorObj);
    }
};
