
import React from 'react'
import Button from '@material-ui/core/Button';
import MiBand from 'miband';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeDevice, changeLoading } from '../actions'
import { withSnackbar } from 'notistack';

class ButtonConnectart extends React.Component {

    constructor(props) {
        super(props)
        this.connectar = this.connectar.bind(this)
    }

    async connectar(log) {
        this.props.changeLoading(true)
        let device;
        if (!this.props.bluetooth) {
            log('WebBluetooth is not supported by your browser!');
            return;
        }
        log('Requesting Bluetooth Device...');
        if (!this.props.device) {
            device = await this.props.bluetooth.requestDevice({
                filters: [
                    { services: [MiBand.advertisementService] }
                ],
                optionalServices: MiBand.optionalServices
            });
            await this.props.changeDevice(device)
        }
        
        device.addEventListener('gattserverdisconnected', async () => {
            log('Device disconnected');
            await device.gatt.disconnect();
            this.props.enqueueSnackbar('Pulseira desconectada', { variant: 'error' });
        });

        await device.gatt.disconnect();
        this.props.changeLoading(false)

    }

    render() {
        return (
            <Button variant="contained" color="primary" onClick={() => this.connectar(console.log)}>Conectar</Button>
        )
    }
}

const mapStateToProps = state => ({
    device: state.user.device,
    bluetooth: state.user.bluetooth,
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeDevice, changeLoading }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(ButtonConnectart));
