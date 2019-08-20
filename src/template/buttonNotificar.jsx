


import React from 'react'
import Button from '@material-ui/core/Button';
import Miband from 'miband'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeMiband, changeLoading } from '../actions'

let retry = 0
class ButtonNotificar extends React.Component {

    constructor(props) {
        super(props)
        this.notigicarPulseira = this.notigicarPulseira.bind(this)
    }

    async notigicarPulseira(log) {
        this.props.changeLoading(true)
        try {
            const server = await this.props.device.gatt.connect();
            let miband = new Miband(server);
            this.props.changeMiband(miband)
            await miband.init();
            miband.showNotification('message');
            this.props.changeLoading(false)
        } catch (error) {
            log('Error: ' + error.message || error)
            if (retry > 4) {
                this.props.changeLoading(false)
            } else {
                retry += 1;
                this.notigicarPulseira(log)
            }
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

const mapDispatchToProps = dispatch => bindActionCreators({ changeMiband, changeLoading }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ButtonNotificar);