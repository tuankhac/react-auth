import React from 'react';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('/api/logout', {
      method: 'POST'
    }).then(res => {
      if (res.status === 200) {
        window.location.href = "login";
      } else {
        const error = new Error(res.error);
        throw error;
      }
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    return ''
  }
}

export default Logout;