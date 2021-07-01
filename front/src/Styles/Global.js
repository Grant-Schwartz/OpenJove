const Colors = {
    primary: 'rgba(0, 111, 250, 1)',
    primary_75: 'rgba(0, 111, 250, .75)',
    primary_50: 'rgba(0, 111, 250, .5)',
    primary_25: 'rgba(0, 111, 250, .25)',
    secondary: 'rgba(255, 149, 0, 1)',
    secondary_75: 'rgba(255, 149, 0, .75)',
    secondary_50: 'rgba(255, 149, 0, .5)',
    secondary_25: 'rgba(255, 149, 0, .25)',
    danger: 'rgba(255, 59, 48, 1)',
    danger_75: 'rgba(255, 59, 48, .75)',
    danger_50: 'rgba(255, 59, 48, .5)',
    danger_25: 'rgba(255, 59, 48, .25)',
    body: 'rgba(0,0,0,0.8)',
    shade: 'rgba(0,0,0,0.075)'
}

const Header = {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '36px',
    lineHeight: '44px',
    letterSpacing: '-0.05em',
    color: '#000',
    margin: 0
}

const SubHeader = {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '29px',
    letterSpacing: '-0.02em',
    color: '#000',
    margin: 0
}

const SubTitle = {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '29px',
    letterSpacing: '-0.02em',
    color: '#000',
    margin: 0
}

const Body = {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '22px',
    letterSpacing: '0.005em',
    color: 'rgba(0,0,0,0.8)'
}

const Logo = {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '22px',
    lineHeight: '28px',
    letterSpacing: '-0.025em',
    color: '#000'
}

const PageWrapper = {
    paddingLeft: '20px',
    paddingRight: '20px'
}

const CardWrapper = {
    border: `2px solid ${Colors.shade}`,
    borderRadius: 10,
    marginTop: '30px',
    padding: '20px'
}

export const GlobalStyles = {
    Colors: Colors,
    Header: Header,
    SubHeader: SubHeader,
    SubTitle: SubTitle,
    Body: Body,
    Logo: Logo,
    PageWrapper: PageWrapper,
    CardWrapper: CardWrapper
}