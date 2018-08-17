import React from 'react';
import { View } from 'react-native';
import { StyleManager } from '../../Styles/StyleManager';

export class SeparateLine extends React.PureComponent {
    public render() {
        return (
            <View
                backgroundColor={StyleManager.separatorColor}
                height={StyleManager.separatorThickness}
                marginTop={StyleManager.separatorSpacing}
                marginRight={StyleManager.separatorSpacing}
                marginBottom={StyleManager.separatorSpacing}
                marginLeft={StyleManager.separatorSpacing}
            />
        );
    }
}
