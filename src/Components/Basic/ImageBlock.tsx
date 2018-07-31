import * as React from 'react';
import {
    Image,
    LayoutChangeEvent,
    Text,
    View
} from 'react-native';
import { HostContext } from '../../Contexts/HostContext';
import { HostRenderer, ISVGRenderer } from '../../HostRenderer/HostRenderer';
import { StyleManager } from '../../Styles/StyleManager';
import { ImageUtils } from '../../Utils/ImageUtils';
import { IFlexProps } from '../BaseProps';
import { FlexBox } from './FlexBox';

interface IProps extends IFlexProps {
    url: string;
    alt?: string;
    maxWidth?: number;
    maxHeight?: number;
    fitAxis?: 'h' | 'v';
    onImageSize?: (width: number, height: number) => void;
    onPress?: () => void;
    boxStyle?: any;
    imgStyle?: any;
}

interface IState {
    loaded: boolean;
    width: number;
    height: number;
}

export class ImageBlock extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loaded: true,
            width: undefined,
            height: undefined,
        };
    }

    public render() {
        const {
            url,
            boxStyle,
            alignSelf,
            onPress,
            width,
        } = this.props;

        if (url && url.startsWith('data:image/svg+xml')) {
            let svgRenderer: ISVGRenderer = HostContext.getInstance().getHostRenderer(HostRenderer.SVG);
            let svgSize = typeof width === 'number' ?
                width : StyleManager.getInstance().getImageSize('large') as number;
            if (svgRenderer) {
                return (
                    <FlexBox
                        {...this.props}
                        style={[
                            boxStyle,
                            {
                                alignSelf: alignSelf,
                            }
                        ]}
                        onPress={onPress}
                        width='auto'
                    >
                        {svgRenderer(decodeURIComponent(url), svgSize, svgSize)}
                    </FlexBox>
                );
            } else {
                return undefined;
            }
        } else {
            return (
                <FlexBox
                    {...this.props}
                    style={[
                        boxStyle,
                        {
                            alignSelf: alignSelf,
                        }
                    ]}
                    onLayoutChange={this.onLayoutChange}
                    onPress={onPress}
                    width='auto'
                >
                    {this.renderPlaceholder()}
                    {this.renderImage()}
                </FlexBox>
            );
        }
    }

    private renderPlaceholder = () => {
        if (!this.state.loaded) {
            return (
                <View
                    style={[
                        {
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 32,
                            color: 'rgba(0, 0, 0, 0.5)',
                            textAlign: 'center'
                        }}
                    >
                        {'\uE601'}
                    </Text>
                </View>
            );
        }
        return undefined;
    }

    private renderImage() {
        return (
            <Image
                accessible={!!this.props.alt}
                accessibilityLabel={this.props.alt}
                source={{ uri: this.props.url }}
                style={[
                    this.size,
                    this.props.imgStyle
                ]}
                onLoad={this.onImageLoad}
                onError={this.onImageError}
                onLayout={this.onImageSizeUpdate}
            >
            </Image>
        );
    }

    private fetchImageSize = () => {
        ImageUtils.fetchSize(
            this.props.url,
            this.onImageSize,
            this.onImageSizeError
        );
    }

    private onLayoutChange = () => {
        this.fetchImageSize();
    }

    private onImageSizeUpdate = (event: LayoutChangeEvent) => {
        let width = event.nativeEvent.layout.width;
        let height = event.nativeEvent.layout.height;

        if (this.props.onImageSize) {
            this.props.onImageSize(width, height);
        }
    }

    private onImageSize = (width: number, height: number) => {
        console.log(width);
        console.log(height);
        let size = ImageUtils.calcSize(
            { width: width, height: height },
            { width: this.props.containerWidth, height: this.props.containerHeight },
            this.props.width,
            this.props.fitAxis
        );
        this.setState(size);
    }

    private onImageSizeError = (err: any) => {
        console.log(err);
        console.log(this.props.url);
        this.setState({
            loaded: false
        });
    }

    private onImageLoad = () => {
        this.setState({
            loaded: true
        });
        this.fetchImageSize();
    }

    private onImageError = () => {
        this.setState({
            loaded: false
        });
    }

    private get size() {
        return ImageUtils.fitSize(
            this.state,
            { width: this.props.maxWidth, height: this.props.maxHeight },
            { width: this.props.maxWidth, height: this.props.maxHeight },
            this.props.fitAxis,
        );
    }
}
