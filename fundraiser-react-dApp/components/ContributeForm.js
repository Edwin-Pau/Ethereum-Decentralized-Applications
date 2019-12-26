import React, { Component } from 'react'
import { Form, Input, Message, Button, Icon } from 'semantic-ui-react'
import Fundraiser from '../ethereum/fundraiser'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

class ContributeForm extends Component {
    // Initialize state object
    state = {
        value: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault()
        
        // ContributeForm has a props with the address passed in from display.js
        const fundraiser = Fundraiser(this.props.address)

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts();
            await fundraiser.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            })

            // Force a refresh of the current page
            Router.replaceRoute(`/fundraisers/${this.props.address}`)
        } catch (err) {
            if (err.message === 'No \"from\" address specified in' + 
            ' neither the given options, nor the default options.') {
                this.setState({ errorMessage: 'Please login to a Metamask account!' })
            } else {
                this.setState({ errorMessage: err.message })
            }
        }

        this.setState({ loading: false, value: '' })
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Enter a Contribution Amount</label>
                    <Input 
                        label="ether" 
                        labelPosition="right"
                        value={this.state.value} 
                        onChange={event => this.setState({ value: event.target.value })} 
                    />
                </Form.Field>

                <Message
                        style={{ overflowWrap: 'break-word' }}  
                        error header="Something went wrong!" 
                        content={this.state.errorMessage} 
                />

                <Message icon
                        hidden={!this.state.loading}
                        style={{ overflowWrap: 'break-word' }} >
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Sending your transaction!</Message.Header>
                            We are sending your transaction to this fundraiser contract on the Ethereum blockchain.
                        </Message.Content>
                </Message>

                <Button primary loading={this.state.loading}>
                    Contribute
                </Button>
            </Form>
        )

    }
}

export default ContributeForm;