import React from 'react';
import styled from 'styled-components/native';

const avatar = 'https://scontent.fhan1-1.fna.fbcdn.net/v/t1.0-9/20376189_1845489125466942_2435874566010961993_n.jpg?oh=71c269474e58932989a70189d30fc46a&oe=5A7B4453';

const AVATAR_SIZE = 40;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

const Root = styled.View`
  height: 50;
  flexDirection: row;
`;

const AvatarContainer = styled.View`
  flex: 1;
  alignSelf: stretch;
  justifyContent: center;
`;

const Avatar = styled.Image`
  height: ${AVATAR_SIZE};
  width: ${AVATAR_SIZE};
  borderRadius: ${AVATAR_RADIUS};
`;

const MetaContainer = styled.View`
  flex: 5;
  alignSelf: stretch;
`;

const MetaTopContainer = styled.View`
  flex: 10;
  flexDirection: row;
  alignSelf: stretch;
  alignItems: center;
  justifyContent: flex-start;
`;

const MetaBottomContainer = styled.View`
  flex: 8;
  alignSelf: stretch;
  alignItems: flex-start;
  justifyContent: center;
`;

const MetaFullName = styled.Text`
  fontSize: 16;
  fontWeight: bold;
  color: ${props => props.theme.SECONDARY};
`;

const MetaText = styled.Text`
  fontSize: 14;
  fontWeight: 600;
  color: ${props => props.theme.LIGHT_GRAY};
`;

const FeedCardHeader = () => (
  <Root>
    <AvatarContainer>
      <Avatar source={{ uri: avatar }}/>
    </AvatarContainer>
    <MetaContainer>
      <MetaTopContainer>
        <MetaFullName>Long Le</MetaFullName>
        <MetaText style={{ marginLeft: 5 }}>@vietlong2110</MetaText>
      </MetaTopContainer>
      <MetaBottomContainer>
        <MetaText>1 day ago</MetaText>
      </MetaBottomContainer>
    </MetaContainer>
  </Root>
);

export default FeedCardHeader;