import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Container, Content, List, ListItem, Body } from 'native-base';
import { getUser, getPosition } from '../network';
import StockItems from '../components/DashboardPage/StockItems';

const Dashboard = ({ user }) => {
    const [postionResults, setPostionResults] = useState([]);
    const [rerender, setRerender] = useState(false);
    const [positionDidLoad, setPositionDidLoad] = useState(false);

    useEffect(() => {
        (async () => {
            const postionResults = await getPosition();
            postionResults ? setPositionDidLoad(true) : null;
            setPostionResults(postionResults?.positions);
        })();
    }, [rerender]);

    return (
        <ScrollView style={styles.scrollView}>
            <Container style={{ width: '100%' }}>
                <Content contentContainerStyle={{ flex: 1 }}>
                    <Text style={styles.greetingText}>Hi, {user.username}</Text>
                    <List>
                        <ListItem>
                            <Body style={styles.body}>
                                <Text style={styles.textHeader}>Ticker</Text>
                                <Text style={styles.textHeader}>Price</Text>
                                <Text style={styles.qtyText}>QTY</Text>
                                <Text style={styles.textHeader}>Total</Text>
                                <Text style={styles.textHeader}>
                                    Current price
                                </Text>
                                <Text style={styles.textHeader}>Amount</Text>
                                <Text style={styles.textHeader}>Option</Text>
                            </Body>
                        </ListItem>
                        {positionDidLoad ? (
                            <>
                                {postionResults.length > 0 ? (
                                    <>
                                        {postionResults.map((postionResult) => (
                                            <StockItems
                                                postionResult={postionResult}
                                                setRerender={setRerender}
                                                key={postionResult.symbol}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <Text style={styles.noTransText}>
                                        You have no stocks!
                                    </Text>
                                )}
                            </>
                        ) : (
                            <ActivityIndicator
                                style={styles.loadingIcon}
                                size="large"
                                color="#FF8C00"
                            />
                        )}
                    </List>
                </Content>
            </Container>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    body: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '1%',
        alignItems: 'center',
    },
    greetingText: {
        textAlign: 'center',
        padding: '5%',
        fontSize: 30,
    },
    noTransText: { textAlign: 'center', padding: '5%', fontSize: 15 },
    textHeader: {
        width: '14%',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 13,
    },
    loadingIcon: {
        marginTop: 30,
    },
    qtyText: {
        width: '8%',
    },
});

export default Dashboard;
