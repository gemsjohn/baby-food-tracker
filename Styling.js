import { StyleSheet, Dimensions, StatusBar, PixelRatio } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scaleWidth = SCREEN_WIDTH / 360;
const scaleHeight = SCREEN_HEIGHT / 800;

export const WidthRatio = (size) => {
  const newSize = size * scaleWidth;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

export const HeightRatio = (size) => {
  const newSize = size * scaleHeight;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

export const Styling = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight,
  },
  label: {
    marginBottom: 2,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginVertical: 12,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 50
  },
  newcontainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#050607'
  },
  scrollView: {
    marginHorizontal: 0,
  },
  circlecontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  circle: {
    width: HeightRatio(40),
    height: HeightRatio(40),
    borderRadius: 20,
    margin: HeightRatio(10),
  },
  difficultyButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    alignSelf: 'center',
    margin: 10,
    width: windowWidth / 3 - 1,
    height: windowHeight / 12,
    flexDirection: 'row'
  },
  difficultyText: {
    color: '#001219',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'white',
    color: 'white',
    width: windowWidth - 80,
    alignSelf: 'center',
    height: windowHeight / 3,
    borderRadius: 10,
    padding: 30
  },
  sendButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 40,
    alignSelf: 'center',
    margin: 10,
    width: windowWidth - 80,
    flexDirection: 'row'
  },
  sendButtonText: {
    color: '#001219',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  gridBlock: {
    height: WidthRatio(55),
    width: WidthRatio(55),
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 6,
    borderWidth: 2,
    borderRadius: HeightRatio(10)
  },
  modalDivisionLine: {
    borderColor: '#4cc9f0',
    borderBottomWidth: 1,
    width: WidthRatio(320),
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#d90429'
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 20
  },
  textStyle: {
    color: "white",
    fontSize: HeightRatio(25),
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: 'black',
    fontSize: HeightRatio(30),
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    // backgroundColor: '#240046',
    // marginTop: 30
  },
  scrollContainer: {
    // paddingTop: StatusBar.currentHeight,
  },
  flatlistContainer: {
    flex: 1,
    // marginTop: StatusBar.currentHeight - 20 || 0,
  },
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    borderBottomLeftRadius: 25,
    padding: 10,
    width: windowWidth - 20,
    flexDirection: 'column',
    margin: 10,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: 15,
    marginTop: 2
  },
  title: {
    fontSize: 32,
  },
  letters: {
    alignSelf: 'center',
    fontSize: HeightRatio(44),
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  textInputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
    fontSize: HeightRatio(24),
    display: 'flex',
    justifyContent: 'flex-start',
    padding: HeightRatio(14),
    paddingLeft: HeightRatio(20),
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    borderRadius: HeightRatio(10),
    alignSelf: 'center',
    margin: HeightRatio(8),
    width: windowWidth - 80
  },
  profileContainer: {
    // paddingTop: StatusBar.currentHeight,
  },
  profileScrollView: {
    backgroundColor: 'transparent',
    marginHorizontal: -20,
    alignSelf: "center",
    width: windowWidth - 10,
    height: windowHeight - 100,
    marginTop: 10
  },
  modalWordButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 40,
    alignSelf: 'center',
    // margin: 10,
    width: windowWidth - 80,
    flexDirection: 'row'
  },
  modalWordButtonText: {
    color: '#001219',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  modalFontAwesomeIcons: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10
  },

  profileDivisionLine: {
    borderColor: 'white',
    borderBottomWidth: 1,
    width: windowWidth - 80,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  gameScrollView: {
    backgroundColor: 'transparent',
    marginHorizontal: -20,
  },
  gameCenteredView: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 0
  },
  guessBlock: {
    height: WidthRatio(60),
    width: WidthRatio(60),
    // margin: 2,
    marginLeft: WidthRatio(4),
    marginRight: WidthRatio(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#00b4d8',
    borderWidth: WidthRatio(4),
    borderRadius: WidthRatio(5)
  },
  guessBlocks: {
    height: WidthRatio(30),
    width: WidthRatio(30),
    margin: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: windowWidth - 20,
    height: HeightRatio(650)
  },
  modalContentHeader: {
    color: '#4cc9f0',
    fontSize: HeightRatio(25),
    fontWeight: 'bold',
  },
  modalContent: {
    color: 'white',
    fontSize: HeightRatio(18),
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  modalScoringVarText: {
    color: 'white',
    fontSize: HeightRatio(30),
    // fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row'
  },
  telePadButtonSelected: {
    padding: 6,
    margin: 2,
    borderWidth: 0.5,
    borderColor: '#aaf683',
    width: WidthRatio(100),
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  telePadButton: {
    padding: 6,
    margin: 2,
    borderWidth: 0.5,
    borderColor: 'white',
    width: WidthRatio(100),
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },
  telePadButtonText: {
    fontSize: HeightRatio(20),
    color: 'white'
  },
  modal_centered_view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: HeightRatio(-30)
    // marginTop: 22,
  },
  modal_view: {
    margin: HeightRatio(20),
    width: '100%',
    backgroundColor: "#161b21",
    // borderRadius: 20,
    padding: HeightRatio(35),
    alignItems: "center",
    // shadowColor: "#c5ffff",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 1.0,
    // shadowRadius: 4,
    // elevation: 20
  },
});



