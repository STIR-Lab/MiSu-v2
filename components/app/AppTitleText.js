import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// The component used across the project for Text that is used as a title and underlined.
class AppTitleText extends Component {
	render() {
		return (
			<Text
				style={[
					{
						fontSize: 18.5,
						fontWeight: 'bold',
						textDecorationLine: 'none'
					},
					this.props.style
				]}
			>
				{this.props.children}
			</Text>
		);
	}
}

export default AppTitleText;
