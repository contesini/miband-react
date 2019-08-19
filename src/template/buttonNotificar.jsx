


import React from 'react'
import Button from '@material-ui/core/Button';
import Miband from 'miband'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeMiband } from '../actions'

class ButtonNotificar extends React.Component {

    constructor(props) {
        super(props)
        this.notigicarPulseira = this.notigicarPulseira.bind(this)
    }

    async notigicarPulseira(log) {
        if (this.props.miband) {
            this.props.miband.showNotification('message');
        } else {
            const server = await this.props.device.gatt.connect();
            let miband = new Miband(server);
            this.props.changeMiband(miband)
            await miband.init();
            miband.showNotification('message');
        }
    }

    render() {
        return (
            <Button variant="contained" color="primary" onClick={() => this.notigicarPulseira(console.log)}>Notificar Pulseira</Button>
        )
    }

}

const mapStateToProps = state => ({
    device: state.user.device,
    miband: state.user.miband,
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeMiband }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ButtonNotificar);