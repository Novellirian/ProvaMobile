import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';

type Group = {
  id: number;
  nome: string;
  descricao: string;
  avaliacoes: Avaliacao[];
  integrantes: Integrante[];
};

type Avaliacao = {
  id: number;
  comentario: string;
  nota: number;
  data_avaliacao: string;
};

type Integrante = {
  id: number;
  nome: string;
};

export default function GroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/LoginScreen');
      } else {
        fetchAllGroupData(); // Chama a função de busca de dados se autenticado
      }
    }

    checkAuth();
  }, []);

  async function fetchAllGroupData() {
    setLoading(true);

    try {
      const { data: groupsData, error: groupsError } = await supabase.from('grupos').select('id, nome, descricao');
      if (groupsError) throw groupsError;

      const groupsWithDetails = await Promise.all(
        (groupsData as Group[]).map(async (group) => {
          const { data: avaliacoesData } = await supabase
            .from('avaliacoes')
            .select('id, comentario, nota, data_avaliacao')
            .eq('grupo_id', group.id);
          
          const { data: integrantesData } = await supabase
            .from('alunos')
            .select('id, nome')
            .eq('grupo_id', group.id);

          return {
            ...group,
            avaliacoes: avaliacoesData || [],
            integrantes: integrantesData || [],
          };
        })
      );

      setGroups(groupsWithDetails);
    } catch (error) {
      console.error('Erro ao buscar dados dos grupos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error.message);
    } else {
      router.replace('/LoginScreen');
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#9B5DE5" style={styles.loading} />;
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://disciplinas.uvv.br/assets/images/uvv-brasao.png' }}
          style={styles.image}
        />
        <Text style={styles.title}>GRUPOS INOVAWEEK</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[styles.card, selectedGroup === group.id && styles.selectedCard]}
            onPress={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
          >
            <Text style={styles.cardTitle}>{group.nome}</Text>
            {selectedGroup === group.id && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Descrição: {group.descricao}</Text>

                <Text style={styles.detailsSubtitle}>Integrantes:</Text>
                {group.integrantes.length > 0 ? (
                  group.integrantes.map((integrante) => (
                    <Text key={integrante.id} style={styles.integranteText}>- {integrante.nome}</Text>
                  ))
                ) : (
                  <Text style={styles.noIntegrantesText}>Nenhum integrante encontrado.</Text>
                )}

                <Text style={styles.detailsSubtitle}>Avaliações:</Text>
                {group.avaliacoes.length > 0 ? (
                  group.avaliacoes.map((avaliacao) => (
                    <View key={avaliacao.id} style={styles.avaliacaoContainer}>
                      <Text style={styles.avaliacaoNota}>Nota: {avaliacao.nota}</Text>
                      <Text style={styles.avaliacaoComentario}>{avaliacao.comentario}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noAvaliacoesText}>Nenhuma avaliação disponível.</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9B5DE5',
    marginRight: 'auto',
    marginLeft: 20,
  },
  logoutButton: {
    backgroundColor: '#9B5DE5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    width: Dimensions.get('window').width * 0.3,
    padding: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  selectedCard: {
    borderColor: '#9B5DE5',
    borderWidth: 1.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E4E4E6',
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
    width: '100%',
  },
  detailsText: {
    fontSize: 14,
    color: '#A1A1A3',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B5DE5',
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  integranteText: {
    fontSize: 13,
    color: '#D1D1D3',
    textAlign: 'center',
    marginBottom: 3,
  },
  avaliacaoContainer: {
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    width: '100%',
  },
  avaliacaoNota: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  avaliacaoComentario: {
    fontSize: 13,
    color: '#D1D1D3',
  },
  noAvaliacoesText: {
    fontSize: 12,
    color: '#9B5DE5',
    textAlign: 'center',
  },
  noIntegrantesText: {
    fontSize: 12,
    color: '#9B5DE5',
    textAlign: 'center',
  },
});
